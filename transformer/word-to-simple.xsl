<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
    exclude-result-prefixes="xs w w15"
    version="1.0">

    <xsl:template match="/w:document">
        <form 
            xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml">
            <xsl:apply-templates select="@* | node()"/>
        </form>
    </xsl:template>

    <xsl:template match="w:sdt[./w:sdtPr/w15:repeatingSectionItem]">
        <xsl:element name="item">
            <xsl:apply-templates select="@* | node()"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="w:sdt">
        <xsl:element name="key">
            <xsl:attribute name="name">
                <xsl:value-of select="./w:sdtPr/w:tag/@w:val"/>
            </xsl:attribute>

            <xsl:choose>
                <xsl:when test="./w:sdtPr/w:text">
                    <!-- a plain text field
                    https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.sdtcontenttext?view=openxml-2.8.1
                -->
                    <xsl:attribute name="type">text</xsl:attribute>
                    <xsl:attribute name="value">
                        <xsl:apply-templates select=".//w:t"/>
                    </xsl:attribute>
                </xsl:when>
                <xsl:when test="./w:sdtPr/w15:repeatingSection">
                    <!-- repeatable -->
                    <xsl:attribute name="type">repeatingSection</xsl:attribute>
                    <xsl:apply-templates select="@* | node()"/>
                </xsl:when>
                <xsl:when test="./w:sdtPr/w:richText">
                    <!-- a rich text field
                https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.sdtcontentrichtext?view=openxml-2.8.1-->
                    <xsl:attribute name="type">richtext</xsl:attribute>
                    <content>
                        <xsl:apply-templates select="@* | node()"/>
                    </content>
                </xsl:when>
                <xsl:when test="./w:sdtPr/w:date">
                    <xsl:attribute name="type">datetime</xsl:attribute>
                    <xsl:attribute name="format">
                        <xsl:value-of select="./w:sdtPr/w:date/w:storeMappedDataAs/@w:val"/>
                    </xsl:attribute>
                    <xsl:attribute name="value">
                        <xsl:value-of select="./w:sdtPr/w:date/@w:fullDate"/>
                    </xsl:attribute>
                </xsl:when>
                <xsl:when test="./w:sdtPr/w:dropDownList">
                    <xsl:attribute name="type">select</xsl:attribute>
                    <xsl:variable name="displayContent">
                        <xsl:value-of select=".//w:t/text()"/>
                    </xsl:variable>
                    <xsl:attribute name="display">
                        <xsl:value-of select="$displayContent"/>
                    </xsl:attribute>
                    <xsl:attribute name="value">
                        <xsl:value-of
                            select="./w:sdtPr/w:dropDownList/w:listItem[@w:displayText = $displayContent]/@w:value"
                        />
                    </xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <!-- default to richtext as this is what word does -->
                    <xsl:attribute name="type">richtext</xsl:attribute>
                    <xsl:apply-templates select="@* | node()"/>
                </xsl:otherwise>
            </xsl:choose>

        </xsl:element>
    </xsl:template>


    <!-- WordML to HTML conversions -->

    <!-- Fallback p case. Exclude content without a run element ('w:r')
        Listed first, as later templates override earlier ones.
    -->
    <xsl:template match="w:sdtContent/w:p[w:r]">
        <p>
            <xsl:apply-templates select="@* | node()"/>
        </p>
    </xsl:template>

    <!-- headings -->
    <xsl:template match="w:sdtContent/w:p[starts-with(w:pPr/w:pStyle/@w:val,'Heading')]">
        <xsl:variable name="headingNum">
            <xsl:value-of select="substring-after(w:pPr/w:pStyle/@w:val, 'Heading')"/>
        </xsl:variable>
        <xsl:element name="h{$headingNum}">
            <xsl:apply-templates select="@* | node()"/>
        </xsl:element>
    </xsl:template>
    
    <!-- generic text -->
    <xsl:template match="w:r">
        <xsl:apply-templates select="@* | node()"/>    
    </xsl:template>
    
    <xsl:template
        match="w:sdtContent/w:p/w:r/w:t | w:sdtContent/w:r/w:t | w:sdtContent/w:tc/w:p/w:r/w:t | w:sdtContent/w:tc/w:r/w:t">
        <xsl:value-of select="text()"/>
    </xsl:template>

    <!-- Simple bold/italics -->
    <xsl:template match="w:r[w:rPr/w:b]">
        <strong>
            <xsl:apply-templates select="@* | node()"/>
        </strong>
    </xsl:template>
    <xsl:template match="w:r[w:rPr/w:i]">
        <em>
            <xsl:apply-templates select="@* | node()"/>
        </em>
    </xsl:template>
    <xsl:template match="w:r[w:rPr/w:i][w:rPr/w:b]">
        <strong>
            <em>
                <xsl:apply-templates select="@* | node()"/>
            </em>
        </strong>
    </xsl:template>

    <!-- lists -->
    <xsl:template
        match="//w:sdtContent/w:p[w:pPr/w:pStyle/@w:val = 'ListParagraph']">
    </xsl:template>
    <xsl:template
        match="//w:sdtContent/w:p[w:pPr/w:pStyle/@w:val = 'ListParagraph']
        [
            not(./preceding-sibling::w:p[position() = 1]/w:pPr/w:pStyle/@w:val = 'ListParagraph')
            or (
                ./preceding-sibling::w:p[position() = 1]/w:pPr/w:pStyle/@w:val = 'ListParagraph'
                and (
                    ./preceding-sibling::w:p[position() = 1]/w:pPr/w:numPr/w:numId/@w:val != ./w:pPr/w:numPr/w:numId/@w:val
                )
            )
        ]
        ">
        <xsl:variable name="listType">
            <xsl:choose>
                <xsl:when test="w:pPr/w:numPr/w:numId/@w:val = '1'">ul</xsl:when>
                <xsl:otherwise>ol</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:element name="{$listType}">
            <xsl:apply-templates mode="inject" select="."/>
            <xsl:variable name="nextsibling">
                <xsl:copy-of select="./following-sibling::w:p[position() = 1]"/>
            </xsl:variable>
        </xsl:element>
    </xsl:template>
    <xsl:template mode="inject" match="w:p[w:pPr/w:pStyle/@w:val = 'ListParagraph']">
        <xsl:element name="li">
            <!-- xsl:attribute name="numberingId">
                <xsl:value-of select="w:pPr/w:numPr/w:numId/@w:val"/>
            </xsl:attribute -->
            <p>
                <xsl:apply-templates select="@* | node()"/>
            </p>
            <xsl:if test="./following-sibling::w:p[position() = 1]/w:p/w:pPr/w:pStyle/@w:val = 'ListParagraph'
                and ./following-sibling::w:p[position() = 1]/w:p/w:pPr/w:numPr/w:numId/@w:val = ./w:pPr/w:numPr/w:numId/@w:val
                and ./following-sibling::w:p[position() = 1]/w:p/w:pPr/w:numPr/w:ilvl/@w:val > ./w:pPr/w:numPr/w:ilvl/@w:val
                ">
                <xsl:variable name="listType">
                    <xsl:choose>
                        <xsl:when test="w:pPr/w:numPr/w:numId/@w:val = '1'">ul</xsl:when>
                        <xsl:otherwise>ol</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:element name="{$listType}">
                    <xsl:apply-templates mode="inject" select="./following-sibling::w:p[position() = 1]"/>
                </xsl:element>
            </xsl:if>
        </xsl:element>

        <xsl:if test="./following-sibling::w:p[position() = 1]/w:p/w:pPr/w:pStyle/@w:val = 'ListParagraph'
            and (
            ./following-sibling::w:p[position() = 1]/w:p/w:pPr/w:numPr/w:numId/@w:val = ./w:pPr/w:numPr/w:numId/@w:val
            )
        ">
            <xsl:apply-templates mode="inject" select="./following-sibling::w:p[position() = 1]"/>
        </xsl:if>
    </xsl:template>



    <xsl:template match="w:t[../w:rPr/w:rStyle/@w:val = 'PlaceholderText']">
        <!-- Don't pull over placeholder text -->
    </xsl:template>

    <xsl:template match="@*">
        <xsl:attribute name="{local-name()}">
            <xsl:value-of select="."/>
        </xsl:attribute>
    </xsl:template>

    <!-- 
    <!- - IdentityTransform - ->
    <xsl:template match="w:sdt|w:sdtPr|w:sdtContent">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()" />
        </xsl:copy>
    </xsl:template>
    -->
    <!-- ProcessTransform -->
    <xsl:template match="/ | @* | node()">
        <xsl:apply-templates select="@* | node()"/>
    </xsl:template>


</xsl:stylesheet>
