using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Services;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace GrabABook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IDatabaseService _dbService;

    public AdminController(IDatabaseService dbService)
    {
        _dbService = dbService;
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportDatabaseToWord()
    {
        try
        {
            // Create a memory stream to hold the document
            using var memoryStream = new MemoryStream();
            
            // Create the Word document
            using (var wordDocument = WordprocessingDocument.Create(memoryStream, WordprocessingDocumentType.Document, true))
            {
                // Add main document part
                var mainPart = wordDocument.AddMainDocumentPart();
                mainPart.Document = new Document();
                var body = mainPart.Document.AppendChild(new Body());

                // Add title
                AddTitle(body, "Grab-a-Book Database Export");
                AddParagraph(body, $"Export Date: {DateTime.Now:MMMM dd, yyyy HH:mm:ss}");
                AddParagraph(body, "");

                // Export Books
                var books = await _dbService.GetAllBooksAsync();
                AddHeading(body, $"Books ({books.Count} total)");
                AddParagraph(body, "");
                
                foreach (var book in books)
                {
                    AddParagraph(body, $"ID: {book.Id}");
                    AddParagraph(body, $"Title: {book.Title}");
                    AddParagraph(body, $"Author: {book.Author}");
                    AddParagraph(body, $"Category: {book.Category}");
                    AddParagraph(body, $"Available: {(book.Available ? "Yes" : "No")}");
                    AddParagraph(body, $"Formats: {book.Formats}");
                    AddParagraph(body, $"Popularity: {book.Popularity}");
                    AddParagraph(body, "-------------------");
                }

                AddParagraph(body, "");
                AddParagraph(body, "");

                // Export AP Books
                var apBooks = await _dbService.GetAllAPBooksAsync();
                AddHeading(body, $"AP Books ({apBooks.Count} total)");
                AddParagraph(body, "");
                
                foreach (var book in apBooks)
                {
                    AddParagraph(body, $"ID: {book.Id}");
                    AddParagraph(body, $"Title: {book.Title}");
                    AddParagraph(body, $"Author: {book.Author}");
                    AddParagraph(body, $"Subject: {book.Subject}");
                    AddParagraph(body, $"Type: {book.Type}");
                    AddParagraph(body, $"Available: {(book.Available ? "Yes" : "No")}");
                    AddParagraph(body, $"Formats: {book.Formats}");
                    AddParagraph(body, "-------------------");
                }

                AddParagraph(body, "");
                AddParagraph(body, "");

                // Export Donations
                var donations = await _dbService.GetAllDonationsAsync();
                AddHeading(body, $"Donations ({donations.Count} total)");
                AddParagraph(body, "");
                
                foreach (var donation in donations)
                {
                    AddParagraph(body, $"ID: {donation.Id}");
                    AddParagraph(body, $"Type: {donation.Type}");
                    if (donation.Type == "money")
                    {
                        AddParagraph(body, $"Amount: ${donation.Amount}");
                    }
                    else
                    {
                        AddParagraph(body, $"Book Title: {donation.BookTitle}");
                        AddParagraph(body, $"Book Author: {donation.BookAuthor}");
                        AddParagraph(body, $"Condition: {donation.BookCondition}");
                    }
                    AddParagraph(body, $"Donor: {donation.DonorName}");
                    AddParagraph(body, $"Email: {donation.DonorEmail}");
                    AddParagraph(body, $"Date: {donation.CreatedAt:MMMM dd, yyyy}");
                    AddParagraph(body, $"Status: {donation.Status}");
                    AddParagraph(body, "-------------------");
                }

                // Save the document
                mainPart.Document.Save();
            }

            // Reset stream position
            memoryStream.Position = 0;

            // Return the document as a downloadable file
            var fileName = $"GrabABook_Database_Export_{DateTime.Now:yyyyMMdd_HHmmss}.docx";
            return File(memoryStream.ToArray(), 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error exporting database", error = ex.Message });
        }
    }

    private void AddTitle(Body body, string text)
    {
        var paragraph = body.AppendChild(new Paragraph());
        var run = paragraph.AppendChild(new Run());
        var runProperties = run.AppendChild(new RunProperties());
        runProperties.AppendChild(new Bold());
        runProperties.AppendChild(new FontSize { Val = "32" });
        run.AppendChild(new Text(text));
    }

    private void AddHeading(Body body, string text)
    {
        var paragraph = body.AppendChild(new Paragraph());
        var run = paragraph.AppendChild(new Run());
        var runProperties = run.AppendChild(new RunProperties());
        runProperties.AppendChild(new Bold());
        runProperties.AppendChild(new FontSize { Val = "24" });
        run.AppendChild(new Text(text));
    }

    private void AddParagraph(Body body, string text)
    {
        var paragraph = body.AppendChild(new Paragraph());
        var run = paragraph.AppendChild(new Run());
        run.AppendChild(new Text(text));
    }
}

